import Link from "next/link";
import { Button } from "./ui/button";
import { Page } from "~/enums";
import { ComponentProps } from "react";

const linksToShow: Record<
  Page,
  { pages: Page[]; variant?: ComponentProps<typeof Button>["variant"] }
> = {
  [Page.home]: {
    pages: [Page.calendar, Page.profile],
  },
  [Page.calendar]: {
    pages: [Page.home, Page.profile],
    variant: "outline",
  },
  [Page.profile]: {
    pages: [Page.home, Page.calendar],
    variant: "outline",
  },
};

const pageData: Record<Page, { url: string; label: string }> = {
  [Page.home]: {
    url: "/",
    label: "Add reminder",
  },
  [Page.calendar]: {
    url: "/calendar",
    label: "Calendar",
  },
  [Page.profile]: {
    url: "/profile",
    label: "List",
  },
};

export default function Navigation({ currentPage }: { currentPage: Page }) {
  return (
    <div className="absolute left-0 top-0 m-3 flex gap-2">
      {linksToShow[currentPage].pages.map((e) => (
        <Button variant={linksToShow[e].variant ?? "default"}>
          <Link href={pageData[e].url}>{pageData[e].label}</Link>
        </Button>
      ))}
    </div>
  );
}
