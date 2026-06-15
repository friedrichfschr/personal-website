const particles = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${8 + ((index * 37) % 86)}%`,
  top: `${6 + ((index * 23) % 82)}%`,
  size: `${0.16 + (index % 5) * 0.045}rem`,
  delay: `${index * -0.72}s`,
  duration: `${12 + (index % 7) * 2.1}s`,
}));

export function AmbientParticles({ className = '' }) {
  return (
    <div className={`ambient-particles ${className}`.trim()} aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          style={{
            '--particle-left': particle.left,
            '--particle-top': particle.top,
            '--particle-size': particle.size,
            '--particle-delay': particle.delay,
            '--particle-duration': particle.duration,
          }}
        />
      ))}
    </div>
  );
}
