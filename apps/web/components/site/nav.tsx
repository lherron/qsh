import { getStarCount, getVersion } from "@/lib/site";
import { NavBar } from "./nav-bar";

export async function Nav() {
  const version = getVersion();
  const stars = await getStarCount();
  return <NavBar version={version.short} stars={stars} />;
}
