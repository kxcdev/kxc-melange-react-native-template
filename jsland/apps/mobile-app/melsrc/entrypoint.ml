open Kxc_react_helpers
open Kxc_react_native_helpers

let step1_title = "The first step"

module Imported = struct
  external platform_os : string = "OS"
  [@@mel.module "react-native"][@@mel.scope "Platform"]
end

module OCaml_section = struct
  let log_module = sprintf "OCaml_section.body(os=%s)" Imported.platform_os

  let section_title = "Melange (OCaml) Component"
  let[@react.component] body ?(initialCounterValue = 0) () =
    let os_str = match Imported.platform_os with
      | "ios" -> "iOS"
      | "android" -> "Android"
      | os_code -> String.capitalize_ascii os_code
    in
    let open ReactNative in
    let logv fmt = Log0.verbose ~modul:log_module fmt in
    let counter, updateCounter = React.useState (constant initialCounterValue) in
    fragment [
      text_str &
        sprintf
          "Hello from %s coded using OCaml (more specifically Melange)!"
          os_str;
      text_str "\n";
      fragment [
          button () ~title:"Bump"
            ~onPress:(fun() ->
              updateCounter succ;
              logv "Bump tapped");
          button () ~title:"Reset"
            ~onPress:(fun() ->
              updateCounter (constant initialCounterValue);
              logv "Reset tapped");
          text_str (sprintf "Counter = %d" counter);
        ]
    ]
end

