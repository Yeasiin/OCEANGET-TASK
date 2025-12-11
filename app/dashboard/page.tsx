import { cookies } from "next/headers";
import Image from "next/image";
import LogoutButton from "@/components/Logout";
import { redirect } from "next/navigation";
import axios from "axios";

export default async function Page() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user;
  try {
    const res = await axios.get("https://reqres.in/api/users/2", {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": process.env.REQRES_API_KEY || "",
      },
    });
    user = res.data.data;
  } catch (err) {
    console.error(err);
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          <Image
            height={120}
            width={120}
            src={user.avatar}
            alt="User Avatar"
            className="w-28 h-28 rounded-full border-4 border-gray-200 shadow-sm object-cover"
          />

          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            {user.first_name} {user.last_name}
          </h1>

          <p className="text-gray-500">{user.email}</p>
        </div>

        <div className="my-6 border-t"></div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">User ID</span>
            <span className="text-gray-900">{user.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Full Name</span>
            <span className="text-gray-900">
              {user.first_name} {user.last_name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Email</span>
            <span className="text-gray-900">{user.email}</span>
          </div>
        </div>

        <LogoutButton />
      </div>
    </div>
  );
}
