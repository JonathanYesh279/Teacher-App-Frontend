import { OrchestraPreview } from './OrchestraPreview'

export function OrchestraList({ orchestras = [] }) {
  if (!orchestras.length) return <div>No orchestras found</div>

  return (
    <div className='orchestra-list'>
      {orchestras.map(orchestra => (
        <OrchestraPreview key={orchestra._id} orchestra={orchestra}
        />
      ))}
    </div>
  )
}