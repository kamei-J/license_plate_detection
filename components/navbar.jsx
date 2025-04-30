import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between w-screen items-center bg-slate-800 px-20 py-1">
      <Link className="text-white font-bold" href={"/"}>
        Profile                           
      </Link>
    </nav>
  );
}