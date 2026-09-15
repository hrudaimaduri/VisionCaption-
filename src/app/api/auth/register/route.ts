import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Do not log the raw body to avoid logging passwords
    
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }
    
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }
    
    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: email.split("@")[0],
      },
    });

    return NextResponse.json({ message: "User created", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error: any) {
    // Only log the error message on the server, ensuring no sensitive data is logged
    console.error("Registration error (server-side):", error?.message || error);
    
    // If it's a Prisma error, it might be database connectivity
    if (error?.code) {
      console.error("Prisma Error Code:", error.code);
      return NextResponse.json({ message: "Database connection error. Please try again later." }, { status: 503 });
    }
    
    return NextResponse.json({ message: "An unexpected error occurred during registration. Please try again." }, { status: 500 });
  }
}
