import { useOutletContext, useParams, Link } from 'react-router-dom'


export function OrchestraDetails() {
  const { id } = useParams()
  const orchestras = useOutletContext()

  const orchestra = orchestras.find(orchestra => orchestra._id === id)

  if (!orchestra) return <div>Orchestra not found</div>

  return (
    <div className='orchestra-details'>
      <Link to='/orchestras'>
        <span className='material-symbols-outlined'>arrow_back</span>
      </Link>
      <div className='details-info'>
        <h1>OrchestraDetails</h1>
      </div>
    </div>
  )
}