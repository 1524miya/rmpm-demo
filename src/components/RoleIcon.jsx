const roleIcons = {
  reporter: {
    src: '/images/reporter.png',
    alt: '記者・メディア',
  },
};

export default function RoleIcon({ role, className = '' }) {
  const icon = roleIcons[role];
  if (!icon) return null;

  return <img className={`role-icon role-icon-${role} ${className}`.trim()} src={icon.src} alt={icon.alt}/>;
}
