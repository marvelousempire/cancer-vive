# Cancer Vive owns three app targets. These targets build; they do not claim runtime proof.
.PHONY: check web mac native
check:
	npm run check:content
	npm run check:suits
	npm test
web: check
	npm run build
mac: check
	npm run build:mac-content
	cargo test --locked --manifest-path apps/cancer-vive-desktop/src-tauri/Cargo.toml
	npm --prefix apps/cancer-vive-desktop run build
native:
	node scripts/prepare-apple.mjs --write
	$(MAKE) check
	xcodegen generate --spec interface/swift/project.yml
	mkdir -p .build
	swiftc interface/swift/Sources/ContentModels.swift interface/swift/Tests/main.swift -o .build/native-content-tests
	.build/native-content-tests src/user-messages.json
	xcodebuild -project interface/swift/CancerViveNative.xcodeproj -scheme CancerViveNative -configuration Release -destination 'platform=macOS' -derivedDataPath .build/native-derived CODE_SIGN_IDENTITY=- build
