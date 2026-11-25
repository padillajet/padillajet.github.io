import { useEffect, useState } from 'react'
import { pixelCertificatePreview } from '../data/certificatePreview'
import { db } from '../data/db'
import type { Certificate } from '../data/db'
import InventoryPanel from './InventoryPanel'

function CertificateCard({ certificate }: { certificate: Certificate }) {
  const [failed, setFailed] = useState(false)
  const preview = pixelCertificatePreview(certificate.file_url)

  return <li>
    <a className="pixel-certificate-card" href={certificate.link_url || certificate.file_url}
      target="_blank" rel="noreferrer">
      <span className="pixel-certificate-frame" aria-hidden="true">
        {preview && !failed
          ? <img src={preview} alt="" loading="lazy" onError={() => setFailed(true)} />
          : <span className="pixel-certificate-paper" />}
      </span>
      <strong>{certificate.title}</strong>
      <span>{certificate.issuer}</span>
    </a>
  </li>
}

export default function CertificatesPreview({ onBack }: { onBack: () => void }) {
  const [certificates, setCertificates] = useState<Certificate[] | null>(null)

  useEffect(() => {
    let mounted = true
    void db.getCerts().then(items => { if (mounted) setCertificates(items) })
    return () => { mounted = false }
  }, [])

  return <InventoryPanel kind="certificates" onBack={onBack}>
    {certificates?.length
      ? certificates.map(certificate => <CertificateCard key={certificate.id} certificate={certificate} />)
      : <li>{certificates ? 'No certificates yet.' : 'Loading certificates…'}</li>}
  </InventoryPanel>
}
