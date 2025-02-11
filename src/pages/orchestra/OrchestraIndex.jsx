import { Outlet, useParams } from "react-router"
import { OrchestraList } from "../../components/orchestra/OrchestraList"
import { orchestraService } from './../../service/orchestra.service';
import { useEffect, useState } from "react";

export function OrchestraIndex() {
  const [orchestras, setOrchestras] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  console.log(orchestras)

  useEffect(() => {
    loadOrchestras()
  }, [])

 async function loadOrchestras() {
   try {
     setIsLoading(true);
     const orchestras = await orchestraService.query();
     console.log('Response from backend:', orchestras);
     setOrchestras(orchestras);
   } catch (err) {
     console.error('Error:', err);
     setError(err);
   } finally {
     setIsLoading(false);
   }
 }

  return (
    <div className='orchestra-index'>
      {isLoading && (
        <div className='loading'>
          <div className='spinner'></div>
        </div>
      )}

      {error && (
        <div className='error-message-container'>
          <span className='material-symbols-outlined'>arrow_back_ios_new</span>
          <div className='error-message'>Error: {error}</div>
        </div>
      )}
      {id ? (
        <Outlet context={orchestras} />
      ) : (
        <OrchestraList orchestras={orchestras || []} />
      )}
    </div>
  );
}