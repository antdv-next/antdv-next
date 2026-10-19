---
'antdv-next': patch
---

fix(FormItem): resolve the field key and form context at registration time instead of reading them inside the unmount `onCleanup` - the reactive read was recorded as a dependency of the parent render effect, keeping the Form instance and the already removed DOM subtree alive (detached DOM memory leak for `a-form-item` with `name`)
