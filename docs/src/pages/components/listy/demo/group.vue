<docs lang="zh-CN">
通过 `group` 从数据项中取出分组键并渲染分组标题，开启 `sticky` 后分组标题会在滚动时吸顶。
</docs>

<docs lang="en-US">
Use `group` to derive a group key from each item and render group headers. With `sticky` enabled, the current group header sticks to the top while scrolling.
</docs>

<script setup lang="ts">
import { Avatar, Flex } from 'antdv-next'
import { h } from 'vue'

interface Contact {
  id: number
  name: string
}

const firstNames = [
  'Aaron',
  'Alice',
  'Bella',
  'Brian',
  'Chloe',
  'Colin',
  'Daisy',
  'David',
  'Elena',
  'Eric',
  'Fiona',
  'Frank',
  'Grace',
  'Gavin',
  'Hannah',
  'Henry',
  'Iris',
  'Ivan',
  'Jack',
  'Julia',
  'Kevin',
  'Kylie',
  'Laura',
  'Leo',
  'Mason',
  'Mia',
  'Nina',
  'Noah',
  'Olivia',
  'Oscar',
  'Peter',
  'Paula',
  'Quinn',
  'Rachel',
  'Ryan',
  'Sara',
  'Steve',
  'Tina',
  'Tom',
  'Uma',
  'Victor',
  'Vera',
  'Wendy',
  'Will',
  'Xander',
  'Yara',
  'Zack',
  'Zoe',
]

const lastNames = [
  'Adams',
  'Baker',
  'Carter',
  'Diaz',
  'Evans',
  'Foster',
  'Garcia',
  'Hayes',
  'Ingram',
  'Jensen',
  'Kim',
  'Lopez',
  'Miller',
  'Nguyen',
  'Ortiz',
  'Parker',
  'Quincy',
  'Reed',
  'Smith',
  'Turner',
]

const contacts: Contact[] = firstNames
  .flatMap((firstName, i) =>
    Array.from(
      { length: 4 },
      (_, j) => `${firstName} ${lastNames[(i * 7 + j * 5) % lastNames.length]}`,
    ),
  )
  .sort()
  .map((name, id) => ({ id, name }))

const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068']

const colorOf = (letter: string) => colors[(letter.charCodeAt(0) - 65) % colors.length]

function itemRender(contact: Contact) {
  const letter = contact.name[0]
  return h(Flex, { gap: 'small', align: 'center' }, () => [
    h(Avatar, { size: 'small', style: { backgroundColor: colorOf(letter) } }, () => letter),
    h('span', {}, contact.name),
  ])
};
</script>

<template>
  <a-listy
    :items="contacts" :row-key="(item) => item.id" :height="400" :item-render="itemRender" :group="{
      key: (contact) => contact.name[0],
      title: (letter) => letter,
    }" :sticky="true"
  />
</template>
