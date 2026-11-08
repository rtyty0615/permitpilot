import { Checker } from "@/components/Checker";
import { listCities } from "@/lib/cities";

export default async function Home() {
  const cities = await listCities();
  return <Checker cities={cities} />;
}
