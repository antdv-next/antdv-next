export interface EnterpriseSponsor {
  name: string
  logo: string
  href: {
    en: string
    cn: string
  }
}

export const enterpriseSponsors: EnterpriseSponsor[] = [
  {
    name: 'YouMind',
    logo: 'https://mdn.alipayobjects.com/huamei_vmgq1x/afts/img/A*SXcuQYBZ6oQAAAAAQJAAAAgAeh6VAQ/original',
    href: {
      en: 'https://youmind.com?utm_source=antdv-next',
      cn: 'https://youmind.com/zh-CN?utm_source=antdv-next',
    },
  },
  {
    name: 'TRACTIAN',
    logo: 'https://mdn.alipayobjects.com/huamei_vmgq1x/afts/img/A*Z4-4Q67SG5UAAAAAQLAAAAgAeh6VAQ/original',
    href: {
      en: 'https://tractian.com?utm_source=antdv-next',
      cn: 'https://tractian.com?utm_source=antdv-next',
    },
  },
  {
    name: 'LobeHub',
    logo: 'https://unpkg.com/@lobehub/icons-static-svg@1.79.0/icons/lobehub-color.svg',
    href: {
      en: 'https://lobehub.com?utm_source=antdv-next',
      cn: 'https://lobehub.com?utm_source=antdv-next',
    },
  },
]
