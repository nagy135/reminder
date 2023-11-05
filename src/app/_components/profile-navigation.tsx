import Link from "next/link";
import { Button } from "./ui/button";

export default function ProfileNavigation({
  list = false,
}: {
  list?: boolean;
}) {
  return (
    <div className="absolute left-0 top-0 m-3 flex gap-2">
      <Button variant="outline" className="">
        <Link href="/">Add reminder</Link>
      </Button>
      <Button variant="secondary" className="">
        <Link href={list ? "/profile" : "/calendar"}>
          {list ? "List" : "Calendar"}
        </Link>
      </Button>
    </div>
  );
}
