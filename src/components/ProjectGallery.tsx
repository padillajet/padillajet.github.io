import type { Project } from '../data/db'

export default function ProjectGallery({ project }: { project: Project }) {
  const images = [
    ...(project.image_url ? [project.image_url] : []),
    ...(project.images || []),
  ]

  return (
    <div className="modal-img-scroll">
      {(images.length > 0 ? images : ['/images/default_logo.png']).map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`${project.title} screenshot ${index + 1}`}
          className="modal-img-scroll-item"
        />
      ))}
    </div>
  )
}
