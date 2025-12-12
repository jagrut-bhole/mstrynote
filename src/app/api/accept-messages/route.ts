import { dbConnect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserModel } from "@/src/models/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { message: "Not Authenticated!!", success: false },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();   // FIXED

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },         // FIXED
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { message: "User not found!!", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        message: "User status changed successfully!!",
        success: true,
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update acceptance status:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      { message: "Not Authenticated!!", success: false },
      { status: 401 }
    );
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return Response.json(
        { message: "User not found!!", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while getting acceptance status:", error);
    return Response.json(
      { message: "Error in getting acceptance status", success: false },
      { status: 500 }
    );
  }
}
