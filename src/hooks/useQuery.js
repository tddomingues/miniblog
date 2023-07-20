import {useLocation} from "react-router-dom"
import { useMemo } from "react"

export function useQuery() {
    //url: http://localhost:3000/search?q=casa
    //query: "?q=casa"
    const {search} = useLocation()
    //o useLocation vai pegar o query e inserir na variavel search: "?q=casa"
    return useMemo(() => new URLSearchParams(search), [search])
    //useMemo vai memoizar o valor do query através da instância da classe.
    //será retornado dessa função "?q=casa".
}