import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
export function sourceLinks(messages, markdown) {
  const links=new Map();
  const add=(label, raw)=>{
    const url=new URL(raw);
    if(url.protocol!=='https:' || url.username || url.password) throw new Error('Source link must be HTTPS without credentials');
    links.set(url.href,{label,url:url.href});
  };
  const walkJSON=value=>{
    if(Array.isArray(value)) value.forEach(walkJSON);
    else if(value && typeof value==='object') {
      if(typeof value.url==='string') add(value.label,value.url);
      Object.values(value).forEach(walkJSON);
    }
  };
  walkJSON(messages.normal_view);
  const tree=unified().use(remarkParse).use(remarkGfm).parse(markdown);
  const label=node=>(node.value??(node.children??[]).map(label).join(''));
  const visit=node=>{
    if(node.type==='link') add(label(node),node.url);
    if(node.type==='definition') add(node.label,node.url);
    (node.children??[]).forEach(visit);
  };
  visit(tree);
  add('Code and release details','https://github.com/marvelousempire/cancer-vive');
  return [...links.values()];
}
