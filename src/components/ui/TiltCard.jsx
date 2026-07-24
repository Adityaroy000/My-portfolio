import { useRef } from 'react'
import PropTypes from 'prop-types'

const TiltCard = ({ children, className = '', style = {}, ...props }) => {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const xc = rect.width / 2
    const yc = rect.height / 2

    // Max 8 degrees tilt to keep it subtle and premium
    const angleX = -(y - yc) / (rect.height / 8)
    const angleY = (x - xc) / (rect.width / 8)

    card.style.setProperty('--rx', `${angleX}deg`)
    card.style.setProperty('--ry', `${angleY}deg`)
    card.style.setProperty('--mx', `${(x / rect.width) * 100}%`)
    card.style.setProperty('--my', `${(y / rect.height) * 100}%`)
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return

    card.style.setProperty('--rx', '0deg')
    card.style.setProperty('--ry', '0deg')
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tilt-card-glow ${className}`}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
      }}
      {...props}
    >
      <div style={{ transform: 'translateZ(10px)', height: '100%' }}>{children}</div>
    </div>
  )
}

TiltCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
}

export default TiltCard
