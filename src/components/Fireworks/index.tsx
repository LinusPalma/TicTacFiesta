import styles from './styles.module.css'

interface FireworksProps {
  onReset: () => void
}

const Fireworks = ({ onReset }: FireworksProps) => {
  return (
    <div className={styles.fireworks}>
      <h1>🎆 Frohes neues Jahr! 🎆</h1>
      {import.meta.env.VITE_DEV_MODE === 'true' && (
        <button onClick={onReset} className={styles.resetButton}>
          Neustart
        </button>
      )}
    </div>
  )
}

export default Fireworks
