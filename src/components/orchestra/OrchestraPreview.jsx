import { Link } from "react-router"

export function OrchestraPreview({ orchestra }) {
  if (!orchestra) return null

  return (
    <Link to={`/orchestras/${orchestra._id}`} className='orchestra-preview-link'>
      <div className='orchestra-preview'>
        <div className='orchestra-info'>
          <div className='orchestra-name'>{orchestra.name}</div>
        </div>
      </div>
    </Link>
  )
}