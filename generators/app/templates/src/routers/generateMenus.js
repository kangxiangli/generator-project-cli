export default function (routers) {
  const test = JSON.parse(JSON.stringify(routers))
  function cherry (tree) {
    const arr = []
    tree.forEach(val => {
      let router = {
        name: val.name,
        meta: {
          title: val.meta.title,
          manageFree: val.meta.manageFree
        }
      }
      if (val.children) {
        router.children = cherry(val.children)
      }
      arr.push(router)
    })
    return arr
  }
  console.log(JSON.stringify(cherry(test)))
}
