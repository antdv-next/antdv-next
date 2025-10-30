export {}

/* prettier-ignore */
declare module 'vue' {
  export interface GlobalComponents {
    AAffix: typeof import('antdv-next')['Affix']
    AButton: typeof import('antdv-next')['Button']
    AAlert: typeof import('antdv-next')['Alert']
    AAnchor: typeof import('antdv-next')['Anchor']
    ASpace: typeof import('antdv-next')['Space']
    ADivider: typeof import('antdv-next')['Divider']
    ASpaceCompact: typeof import('antdv-next')['SpaceCompact']
    AFlex: typeof import('antdv-next')['Flex']
    AConfigProvider: typeof import('antdv-next')['ConfigProvider']
    ACol: typeof import('antdv-next')['Col']
    ARow: typeof import('antdv-next')['Row']
    ABadge: typeof import('antdv-next')['Badge']
    ABadgeRibbon: typeof import('antdv-next')['Badge']['Ribbon']
    ATag: typeof import('antdv-next')['Tag']
    ACheckableTag: typeof import('antdv-next')['CheckableTag']
    ALayout: typeof import('antdv-next')['Layout']
    ALayoutHeader: typeof import('antdv-next')['LayoutHeader']
    ALayoutFooter: typeof import('antdv-next')['LayoutFooter']
    ALayoutContent: typeof import('antdv-next')['LayoutContent']
    ALayoutSider: typeof import('antdv-next')['LayoutSider']
    AEmpty: typeof import('antdv-next')['Empty']
    AResult: typeof import('antdv-next')['Result']
    ASpin: typeof import('antdv-next')['Spin']
    ASkeleton: typeof import('antdv-next')['Skeleton']
    ASkeletonButton: typeof import('antdv-next')['SkeletonButton']
    ASkeletonAvatar: typeof import('antdv-next')['SkeletonAvatar']
    ASkeletonInput: typeof import('antdv-next')['SkeletonInput']
    ASkeletonImage: typeof import('antdv-next')['SkeletonImage']
    ASkeletonNode: typeof import('antdv-next')['SkeletonNode']
  }
}
