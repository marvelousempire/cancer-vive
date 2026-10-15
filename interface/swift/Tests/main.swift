import Foundation
let path=CommandLine.arguments[1]
let data=try Data(contentsOf:URL(fileURLWithPath:path))
let content=try JSONDecoder().decode(ContentFile.self,from:data).normal_view
try content.validate()
precondition(content.topics.count==22)
precondition(content.filtered(query:"castor oil",category:"all",grade:"all").map(\.id)==["castor-oil","castor-fruit-extract"])
precondition(content.filtered(query:" DMSO ",category:"skin",grade:"all").map(\.id)==["comfrey","dmso"])
precondition(content.filtered(query:"not-a-real-topic",category:"all",grade:"all").isEmpty)
var selection=CompareSelection();for id in ["fenugreek","comfrey","dmso","spike-proteins"] { selection.toggle(id) };precondition(selection.ids.count==3);selection.toggle("comfrey");selection.toggle("spike-proteins");precondition(selection.ids==["fenugreek","dmso","spike-proteins"])
var broken=try JSONSerialization.jsonObject(with:data) as! [String:Any];var normal=broken["normal_view"] as! [String:Any];var topics=normal["topics"] as! [[String:Any]];topics[0]["caution"]="";normal["topics"]=topics;broken["normal_view"]=normal
let invalid=try JSONDecoder().decode(ContentFile.self,from:JSONSerialization.data(withJSONObject:broken)).normal_view
var refused=false;do { try invalid.validate() } catch { refused=true };precondition(refused)
print("Native content, search, filter, compare limit and missing-caution refusal: PASS")
