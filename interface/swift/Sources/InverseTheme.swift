import SwiftUI

struct DesignProfile: Decodable {
    struct Domains: Decodable {
        struct Paint: Decodable { let palette: InversePalette }
        let paint: Paint
    }
    let domains: Domains
}
struct InversePalette: Decodable {
    let light: [String:String], dark: [String:String]
    func color(_ role:String, _ scheme:ColorScheme) -> Color {
        let hex = (scheme == .dark ? dark : light)[role] ?? "#155fae"
        let value = UInt32(hex.dropFirst(),radix:16) ?? 0x155fae
        return Color(.sRGB,red:Double((value >> 16) & 255)/255,green:Double((value >> 8) & 255)/255,blue:Double(value & 255)/255,opacity:1)
    }
}
struct InverseTheme: ViewModifier {
    let palette: InversePalette
    @Environment(\.colorScheme) private var scheme
    func body(content:Content) -> some View {
        content
            .foregroundStyle(palette.color("soft",scheme))
            .tint(palette.color("mint",scheme))
            .background(palette.color("bg",scheme))
            .groupBoxStyle(InverseBox(palette:palette,scheme:scheme))
    }
}
struct InverseBox: GroupBoxStyle {
    let palette:InversePalette, scheme:ColorScheme
    func makeBody(configuration:Configuration) -> some View {
        VStack(alignment:.leading) { configuration.label; configuration.content }
            .padding(8)
            .background(palette.color("surface",scheme),in:RoundedRectangle(cornerRadius:12))
            .overlay(RoundedRectangle(cornerRadius:12).stroke(palette.color("line",scheme)))
    }
}
