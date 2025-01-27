import { Outlet, useParams } from "react-router"
import { OrchestraList } from "../../components/orchestra/OrchestraList"
import { orchestraService } from './../../service/orchestra.service';
import { useEffect, useState } from "react";

export function OrchestraIndex() {
  const [orchestras, setOrchestras] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    loadOrchestras()
  }, [])

  async function loadOrchestras() {
    try {
      setIsLoading(true)
      const orchestras = await orchestraService.query()
      setOrchestras(orchestras)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='orchestra-index'>
      {id ? <Outlet context={orchestras} /> : <OrchestraList orchestras={orchestras || []} />}
    </div>
  )
}