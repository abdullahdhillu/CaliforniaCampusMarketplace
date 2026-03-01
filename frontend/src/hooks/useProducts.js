import { useQuery } from "@tanstack/react-query";
import { listProducts } from "../lib/api";

 export default function useProducts(queryInput) {
     const { data, isLoading, isFetching, error } = useQuery({
         queryKey: ["products", queryInput],
         queryFn: () => listProducts(queryInput),
         enabled: true,
         keepPreviousData: true,
        });
return {data, isLoading, isFetching, error};
}