import { useQuery } from "@tanstack/react-query";
import { listCampuses } from "../lib/api";

export default function useCampuses() {
    const { data, error } = useQuery({
    queryKey: ["campuses"],
    queryFn: listCampuses,
    enabled: true
  })
  return {data, error}
}