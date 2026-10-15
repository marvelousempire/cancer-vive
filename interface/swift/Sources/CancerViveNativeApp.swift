import SwiftUI
import FatherConsoleContracts
import FatherNativeConsole

@main
struct CancerViveNativeApp: App {
    var body: some Scene {
        WindowGroup("Cancer Vive Native") {
            if let notes = try? Notes() { CancerReader(notes:notes) }
            else { Text(GeneratedMessages.loadFailed).padding() }
        }.defaultSize(width:1200,height:820)
    }
}
struct Notes {
    let matrix:String, truthFilter:String
    let palette:InversePalette
    let content:StudyContent, release:BuildRecord, claims:String, sources:String
    let sourceLinks:[SourceLink]
    let identity:FatherConsoleIdentity
    init() throws {
        func data(_ name:String,_ type:String) throws -> Data {
            guard let url=Bundle.main.url(forResource:name,withExtension:type) else { throw ContentError.invalid }
            return try Data(contentsOf:url)
        }
        content=try JSONDecoder().decode(ContentFile.self,from:data("user-messages","json")).normal_view
        palette=try JSONDecoder().decode(DesignProfile.self,from:data("design-dna.profile","json")).domains.paint.palette
        try content.validate()
        release=try JSONDecoder().decode(BuildRecord.self,from:data("release","json"))
        matrix=String(decoding:try data("matrix","md"),as:UTF8.self)
        truthFilter=String(decoding:try data("truth-filter","md"),as:UTF8.self)
        claims=String(decoding:try data("claims","md"),as:UTF8.self)
        sources=String(decoding:try data("sources","md"),as:UTF8.self)
        sourceLinks=try JSONDecoder().decode([SourceLink].self,from:data("source-links","json"))
        identity=FatherConsoleIdentity(product:"Cancer Vive",productVersion:release.version,suit:.nativeApple)
    }
}
struct Route:Identifiable,Hashable {
    let id:String, key:String, symbol:String
    static let all:[Route]=[
        .init(id:"dashboard",key:"start",symbol:"house"), .init(id:"mechanisms",key:"topics",symbol:"leaf"),
        .init(id:"matrix",key:"quick",symbol:"tablecells"), .init(id:"education",key:"learn",symbol:"book"),
        .init(id:"research",key:"questions",symbol:"questionmark.bubble")
    ]
}
struct CancerReader:View {
    let notes:Notes
    @State private var route:Route?=Route.all[0]
    @State private var query=""
    @State private var category="all"
    @State private var grade="all"
    @State private var layout="cards"
    @State private var selection=CompareSelection()
    @State private var comparison=false
    @AppStorage("cancer-vive.native.theme.v1") private var theme="auto"
    @Environment(\.colorScheme) private var scheme
    private var c:StudyContent { notes.content }
    private func u(_ key:String)->String { c.ui[key] ?? key }
    private func navigate(_ id:String, _ search:String="") { query=search; category="all"; grade="all"; layout="cards"; route=Route.all.first{$0.id==id} ?? Route.all[0] }
    var body:some View {
        NavigationSplitView {
            List(Route.all,selection:Binding<Route?>(get:{route},set:{newRoute in if newRoute?.id != route?.id { navigate(newRoute?.id ?? "dashboard") }})) { r in Label { Text(u(r.key)) } icon: { Image(systemName:r.symbol).foregroundStyle(notes.palette.color("soft",scheme)) }.tag(r) }
                .navigationTitle("Cancer Vive").frame(minWidth:160)
                .scrollContentBackground(.hidden)
                .background(notes.palette.color("bg",scheme))
        } detail: {
            VStack(spacing:0) {
                Text(u("scope")).font(.callout).frame(maxWidth:.infinity,alignment:.leading).padding()
                ScrollView {
                    VStack(alignment:.leading,spacing:20) {
                        switch route?.id {
                        case "mechanisms": topics
                        case "matrix": quickView
                        case "education": education
                        case "research": questions
                        default: start
                        }
                        Divider()
                        Text(c.pages["footer"] ?? "")
                        Text(u("checked")).font(.caption)
                        Text("\(u("version")) \(notes.release.version)\(notes.release.dirty ? " · " + u("draft") : "")").font(.caption)
                        DisclosureGroup(u("code")) { Text(notes.release.commit).font(.system(.caption,design:.monospaced)); Link(u("code"),destination:URL(string:"https://github.com/marvelousempire/cancer-vive")!) }
                    }.padding(24).frame(maxWidth:1100,alignment:.leading)
                }
                if !selection.ids.isEmpty {
                    HStack { Text("\(selection.ids.count) \(u("selected"))"); Spacer(); Button(u("clear")){selection.ids=[]}; Button(u("compare")){comparison=true}.buttonStyle(.borderedProminent) }.padding().background(notes.palette.color("surface-2",scheme))
                    HStack { ForEach(c.topics.filter{selection.ids.contains($0.id)}) { t in Button("\(t.name) ×"){selection.toggle(t.id)}.accessibilityLabel("\(u("remove")): \(t.name)") } }.padding(.bottom,8)
                }
            }
        }
        .modifier(InverseTheme(palette:notes.palette))
        .toolbar {
            Picker(u("theme"),selection:$theme) { Text(u("auto")).tag("auto");Text(u("light")).tag("light");Text(u("dark")).tag("dark") }.pickerStyle(.segmented).frame(width:220)
        }
        .preferredColorScheme(theme=="light" ? .light : theme=="dark" ? .dark : nil)
        .sheet(isPresented:$comparison) {
            VStack {
                HStack { Text(u("compare")).font(.title2); Spacer(); Button(u("close")){comparison=false}.keyboardShortcut(.cancelAction) }.padding()
                ScrollView([.horizontal,.vertical]) { HStack(alignment:.top,spacing:16) { ForEach(c.topics.filter{selection.ids.contains($0.id)}) { topic in topicCard(topic,full:true).frame(width:320) } }.padding() }
            }.frame(minWidth:1040,minHeight:640)
                .modifier(InverseTheme(palette:notes.palette))
        }
    }
    private func heading(_ title:String,_ text:String)->some View { VStack(alignment:.leading,spacing:10) { Text(title).font(.largeTitle.bold());Text(text).fixedSize(horizontal:false,vertical:true) } }
    private var start:some View {
        VStack(alignment:.leading,spacing:20) {
            heading(c.home.title,c.home.intro)
            HStack { Button(c.home.browse){navigate("mechanisms")}.buttonStyle(.borderedProminent);Button(c.home.spike){navigate("education")} }
            Text(c.home.head).font(.title2.bold())
            ForEach(c.home.choices,id:\.title) { choice in
                GroupBox { VStack(alignment:.leading,spacing:10) {Text(choice.title).font(.headline);Text(choice.text);Button(choice.button){navigate(choice.route,choice.query ?? "")} }.frame(maxWidth:.infinity,alignment:.leading).padding(8) }
            }
            heading(c.home.proof_title,c.home.proof_intro)
            ForEach(c.home.proof_steps,id:\.title) { step in Text(step.title).bold();Text(step.text) }
        }
    }
    private var topics:some View {
        VStack(alignment:.leading,spacing:16) {
            heading(c.pages["topics_title"] ?? "",c.pages["topics_intro"] ?? "")
            TextField(u("search"),text:$query).textFieldStyle(.roundedBorder).accessibilityLabel(u("search"))
            HStack {
                Picker(u("filter"),selection:$category) { Text(u("all_topics")).tag("all"); ForEach(c.categories.keys.sorted(),id:\.self) { key in Text(c.categories[key] ?? key).tag(key) } }
                Picker(u("proof"),selection:$grade) { Text(u("all_proof")).tag("all");ForEach(c.grades.keys.sorted(),id:\.self) { key in Text(c.grades[key]?.label ?? key).tag(key) } }
                Picker(u("details"),selection:$layout) { Text(u("cards")).tag("cards");Text(u("table")).tag("table") }.pickerStyle(.segmented).frame(width:150)
            }
            let filtered=c.filtered(query:query,category:category,grade:grade)
            Text("\(filtered.count) \(u("of")) \(c.topics.count) \(u("results")). \(u("select_limit"))").font(.callout)
            if filtered.isEmpty { Text(u("empty")) }
            if layout=="cards" { ForEach(filtered) { t in topicCard(t) } } else { topicTable(filtered,compare:true) }
        }
    }
    private func proof(_ t:Topic)->some View { Text(c.grades[t.grade]?.label ?? "").font(.caption.bold()) }
    private func compareButton(_ t:Topic)->some View {
        Button(selection.ids.contains(t.id) ? u("selected") : u("add")) { FatherHaptics.impact();selection.toggle(t.id) }
            .disabled(!selection.canAdd(t.id)).accessibilityLabel("\(selection.ids.contains(t.id) ? u("remove") : u("add")): \(t.name)")
    }
    private func caution(_ t:Topic)->some View { VStack(alignment:.leading,spacing:6) { Text(u("caution")).bold();Text(t.caution) }.padding(12).frame(maxWidth:.infinity,alignment:.leading).background(Color.orange.opacity(0.12),in:RoundedRectangle(cornerRadius:8)) }
    private func topicCard(_ t:Topic,full:Bool=false)->some View {
        GroupBox { VStack(alignment:.leading,spacing:12) {
            HStack { proof(t);Spacer(); if !full {compareButton(t)} }
            Text(t.name).font(.title2.bold());Text(t.question).font(.headline);Text(t.answer_label).bold();Text(t.research);sourceLinks(t.sources)
            if let rows=t.study_details { VStack(alignment:.leading,spacing:12) {
                Text(u("study_details")).font(.headline)
                ForEach(rows,id:\.heading) { row in VStack(alignment:.leading,spacing:6) { Text(row.heading).bold();Text(row.text) } }
            } }
            if t.id=="spike-proteins" && !full { Button(c.home.spike){navigate("education")} }
            if full { details(t);caution(t) } else { DisclosureGroup(u("read_more")) {details(t).padding(.top,10);caution(t)} }
        }.frame(maxWidth:.infinity,alignment:.leading).padding(8) }
    }
    private func details(_ t:Topic)->some View { VStack(alignment:.leading,spacing:12) {
        Text(u("research")).bold();Text(t.research);Text(u("human")).bold();Text(t.human);Text(u("next_step")).bold();Text(t.next_step)
        Text(u("sources")).font(.headline);sourceLinks(t.sources)
        DisclosureGroup(u("expert")) { VStack(alignment:.leading,spacing:8) {Text("\(u("form")): \(t.form)");if let exact=t.expert_view?.identity {Text(exact)};Text(t.refs.joined(separator:", ")).font(.system(.caption,design:.monospaced))} }
    } }
    private func sourceLinks(_ sources:[SourceLink])->some View { VStack(alignment:.leading,spacing:8) { ForEach(sources) { source in if let url=URL(string:source.url) { Link(source.label,destination:url) } } } }
    private var quickView:some View {
        VStack(alignment:.leading,spacing:16) { heading(c.pages["quick_title"] ?? "",c.pages["quick_intro"] ?? "")
            topicTable(c.topics,compare:false)
        }
    }
    private func topicTable(_ rows:[Topic],compare:Bool)->some View {
        Group {
            if compare {
                Table(rows) {
                    TableColumn(u("topic")) { topic in Text(topic.name).bold().lineLimit(nil) }.width(min:100,ideal:140,max:180)
                TableColumn(u("summary")) { topic in Text(topic.question + "\n" + topic.answer_label + "\n" + topic.research).lineLimit(nil).padding(.vertical,8) }.width(min:180,ideal:300)
                TableColumn(u("evidence")) { topic in proof(topic) }.width(min:100,ideal:150,max:190)
                TableColumn(u("caution")) { topic in Text(topic.caution).lineLimit(nil).padding(.vertical,8) }.width(min:180,ideal:280)
                    TableColumn(u("compare")) { topic in compareButton(topic) }.width(120)
                }
            } else {
                Table(rows) {
                    TableColumn(u("topic")) { topic in Text(topic.name).bold().lineLimit(nil) }.width(min:100,ideal:140,max:180)
                TableColumn(u("summary")) { topic in Text(topic.question + "\n" + topic.answer_label + "\n" + topic.research).lineLimit(nil).padding(.vertical,8) }.width(min:180,ideal:300)
                TableColumn(u("evidence")) { topic in proof(topic) }.width(min:100,ideal:150,max:190)
                TableColumn(u("caution")) { topic in Text(topic.caution).lineLimit(nil).padding(.vertical,8) }.width(min:180,ideal:280)
                }
            }
        }.frame(height:max(220,min(CGFloat(rows.count)*120,1100)))
    }
    private var education:some View { VStack(alignment:.leading,spacing:16) { heading(c.pages["learn_title"] ?? "",c.pages["learn_intro"] ?? ""); ForEach(c.lessons) { lesson in LessonView(lesson:lesson) } } }
    private var questions:some View {
        VStack(alignment:.leading,spacing:16) {
            heading(c.pages["questions_title"] ?? "",c.pages["questions_intro"] ?? "")
            ForEach(c.questions,id:\.heading) { q in GroupBox { VStack(alignment:.leading,spacing:8){Text(q.heading).font(.headline);Text(q.text)}.frame(maxWidth:.infinity,alignment:.leading) } }
            DisclosureGroup("Full cancer detriment matrix · Expert details") { Text(notes.matrix).font(.system(.caption,design:.monospaced)).textSelection(.enabled) }
            DisclosureGroup("Original eight-review Truth Filter · Expert details") { Text(notes.truthFilter).font(.system(.caption,design:.monospaced)).textSelection(.enabled) }
            Text(u("sources")).font(.title2.bold());Text(c.pages["sources_intro"] ?? "");Text(u("sources_description"))
            DisclosureGroup(u("expert")) { StudyArchive(claims:notes.claims,sources:notes.sources,links:notes.sourceLinks,ui:c.ui) }
        }
    }
}
struct LessonView:View {
    let lesson:Lesson
    @State private var expanded:Bool
    init(lesson:Lesson) { self.lesson=lesson;_expanded=State(initialValue:lesson.id=="spike-proteins") }
    var body:some View { GroupBox { DisclosureGroup(lesson.title,isExpanded:$expanded) { VStack(alignment:.leading,spacing:14) { Text(lesson.intro);ForEach(lesson.sections) { section in Text(section.heading).font(.headline);Text(section.text);ForEach(section.sources) { source in if let url=URL(string:source.url) { Link(source.label,destination:url) } } } }.frame(maxWidth:.infinity,alignment:.leading).padding(.top,12) } } }
}
struct StudyArchive:View {
    let claims:String, sources:String, links:[SourceLink], ui:[String:String]
    @State private var tab="sources"
    var body:some View { VStack(alignment:.leading) { Picker(ui["study_records"] ?? "",selection:$tab) { Text(ui["citations"] ?? "").tag("sources");Text(ui["claims"] ?? "").tag("claims") }.pickerStyle(.segmented);ForEach(links) { source in if let url=URL(string:source.url) { Link(source.label,destination:url) } };Text(tab=="sources" ? sources : claims).font(.system(.caption,design:.monospaced)).textSelection(.enabled) } }
}
