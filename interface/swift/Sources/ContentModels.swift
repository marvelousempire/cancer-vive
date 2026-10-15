import Foundation

struct ContentFile: Decodable { let normal_view: StudyContent }
struct StudyContent: Decodable {
    let ui: [String:String], home: HomeContent, grades: [String:ProofGrade], categories: [String:String]
    let topics: [Topic], lessons: [Lesson], questions: [Question], pages: [String:String]
    func validate() throws {
        guard !topics.isEmpty, Set(topics.map(\.id)).count == topics.count,
              topics.allSatisfy({ grades[$0.grade] != nil && !$0.caution.isEmpty && !$0.refs.isEmpty && !$0.sources.isEmpty }),
              (topics.flatMap(\.sources) + lessons.flatMap { $0.sections.flatMap(\.sources) }).allSatisfy({ URL(string:$0.url)?.scheme == "https" })
        else { throw ContentError.invalid }
    }
    func filtered(query:String, category:String, grade:String) -> [Topic] {
        topics.filter { topic in
            (query.trimmingCharacters(in:.whitespacesAndNewlines).isEmpty || topic.searchText.localizedCaseInsensitiveContains(query.trimmingCharacters(in:.whitespacesAndNewlines))) &&
            (category == "all" || topic.tags.contains(category)) && (grade == "all" || topic.grade == grade)
        }
    }
}
enum ContentError:Error { case invalid }
struct ProofGrade:Decodable { let label:String, description:String }
struct HomeContent:Decodable { let eyebrow:String, title:String, intro:String, browse:String, spike:String, head:String, choices:[Choice], proof_title:String, proof_intro:String, proof_steps:[Step] }
struct Choice:Decodable { let title:String, text:String, route:String, query:String?, button:String }
struct Step:Decodable { let title:String, text:String }
struct Question:Decodable { let heading:String, text:String }
struct SourceLink:Decodable,Identifiable { let label:String, url:String; var id:String { url } }
struct ExpertIdentity:Decodable { let identity:String }
struct StudyDetail:Decodable { let heading:String, text:String }
struct Topic:Decodable,Identifiable {
    let question:String, answer_label:String
    let answer:Bool?
    let id:String, name:String, short:String, form:String, grade:String, summary:String, research:String, human:String, caution:String, next_step:String
    let refs:[String], sources:[SourceLink], tags:[String], expert_view:ExpertIdentity?
    let study_details:[StudyDetail]?
    var searchText:String { ([question,name,form,summary,research,human,caution,next_step] + (study_details ?? []).map { $0.heading + " " + $0.text }).joined(separator:" ") }
}
struct Lesson:Decodable,Identifiable { let id:String, title:String, intro:String, sections:[LessonSection] }
struct LessonSection:Decodable,Identifiable { let heading:String, text:String, sources:[SourceLink]; var id:String { heading } }
struct BuildRecord:Decodable { let version:String, commit:String, dirty:Bool }
struct CompareSelection {
    var ids:[String] = []
    func canAdd(_ id:String) -> Bool { ids.contains(id) || ids.count < 3 }
    mutating func toggle(_ id:String) { if ids.contains(id) { ids.removeAll { $0 == id } } else if canAdd(id) { ids.append(id) } }
}
