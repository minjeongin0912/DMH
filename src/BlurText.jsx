function BlurText({
  text = '',
  delay = 200,
  animateBy = 'words',
  direction = 'top',
  className = '',
  stepDuration = 0.45,
  onAnimationComplete,
}) {
  const segments = animateBy === 'letters' ? text.split('') : text.split(' ');

  const handleAnimationEnd = (index) => {
    if (index === segments.length - 1) onAnimationComplete?.();
  };

  return (
    <p className={`blur-text ${className}`}>
      {segments.map((segment, index) => (
        <span
          className="blur-text-segment"
          style={{
            '--blur-delay': `${index * delay}ms`,
            '--blur-y': direction === 'top' ? '-50px' : '50px',
            '--blur-duration': `${stepDuration * 2}s`,
          }}
          onAnimationEnd={() => handleAnimationEnd(index)}
          key={`${segment}-${index}`}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < segments.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </p>
  );
}

export default BlurText;
