#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{webview::NewWindowResponse, WebviewUrl, WebviewWindowBuilder};
fn allowed_source(url: &str) -> bool {
    if url == "https://github.com/marvelousempire/cancer-vive" { return true; }
    let links: serde_json::Value = serde_json::from_str(include_str!("../../../../literature/source-links.json")).expect("checked sources");
    url.starts_with("https://") && links.as_array().is_some_and(|items| items.iter().any(|item| item["url"].as_str() == Some(url)))
}
fn open_source(url: &str) {
    if allowed_source(url) {
        let _ = std::process::Command::new("/usr/bin/open").arg(url).spawn();
    }
}
fn main() {
    tauri::Builder::default().setup(|app| {
        WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
            .title("Cancer Vive").inner_size(1280.0, 860.0).min_inner_size(760.0, 560.0)
            .on_new_window(|url, _| { open_source(url.as_str()); NewWindowResponse::Deny })
            .on_navigation(|url| { if url.scheme() == "https" { open_source(url.as_str()); false } else { url.host_str() == Some("tauri.localhost") || url.scheme() == "tauri" } })
            .build()?;
        Ok(())
    }).run(tauri::generate_context!()).expect("Cancer Vive could not start");
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test] fn allows_only_filed_sources() {
        assert!(allowed_source("https://pubmed.ncbi.nlm.nih.gov/41376334/"));
        assert!(!allowed_source("https://pubmed.ncbi.nlm.nih.gov/41376334/?redirect=evil"));
        assert!(!allowed_source("file:///etc/passwd"));
        assert!(!allowed_source("https://unknown.example/"));
    }
}
