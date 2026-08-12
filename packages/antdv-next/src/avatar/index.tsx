import type { AvatarGroupProps } from './AvatarGroup'
import InternalAvatar from './Avatar'
import AvatarGroup from './AvatarGroup'

export type { AvatarEmits, AvatarProps, AvatarSlots } from './Avatar'
export type { AvatarGroupRef } from './AvatarGroup'

type CompoundedComponent = typeof InternalAvatar & {
  Group: typeof AvatarGroup
}

const Avatar = InternalAvatar as CompoundedComponent

Avatar.Group = AvatarGroup

export { AvatarGroup }
export default Avatar

export type {
  AvatarGroupProps,
}
