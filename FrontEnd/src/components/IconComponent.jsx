import * as Icons from 'react-icons/io' 

export default function IconComponent({ name, size = 20 }) {
  const LucideIcon = Icons[name]

  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist.`)
    return null
  }

  return <LucideIcon size={size} className='h-5 w-5' />
}
