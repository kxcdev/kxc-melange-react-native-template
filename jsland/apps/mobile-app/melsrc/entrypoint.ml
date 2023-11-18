open Kxc_react_helpers
open Kxc_react_native_helpers

let step1_title = "The first step"

module Guikit = struct
  include ReactNative
  let button ?key ?onPress title = button () ?key ?onPress ~title
  let text_str ?key ?style str = text_str str ?key ?style:(style >? polydict')
  let view ?key ?style children = view children ?key ?style:(style >? polydict')
  let hview ?key ?style children = hview children ?key ?style:(style >? polydict')
end

module Imported = struct
  external platform_os : string = "OS"
  [@@mel.module "react-native"][@@mel.scope "Platform"]
end

module OCaml_section = struct
  let log_module = sprintf "OCaml_section.body(os=%s)" Imported.platform_os

  let section_title = "Melange (OCaml) Component"
  let[@react.component] body ?(initialCounterValue = 0) () =
    let open Guikit in
    let os_str = match Imported.platform_os with
      | "ios" -> "iOS"
      | "android" -> "Android"
      | os_code -> String.capitalize_ascii os_code
    in
    let line_break () = text_str "\n" in
    let logv fmt = Log0.verbose ~modul:log_module fmt in
    let counter, updateCounter = React.useState (constant initialCounterValue) in
    fragment [
      text_str &
        sprintf
          "Hello from %s coded using OCaml (more specifically Melange)!"
          os_str;
      line_break ();
      hview ~style:["gap", `int 6; "padding", `int 4] [
          button "Bump"
            ~onPress:(fun() ->
              updateCounter succ;
              logv "Bump tapped");
          button "Reset"
            ~onPress:(fun() ->
              updateCounter (constant initialCounterValue);
              logv "Reset tapped");
        ];
      line_break ();
      text_str (sprintf "Counter = %d" counter);
    ]
end (* module OCaml_section *)

module Accumulator_example = struct

  module Style = struct
    let container : polydict' = [
        "justifyContent", `string "space-evenly"; "flexGrow", `int 1
      ]
    let accumulator : polydict' = [
        "textAlign", `string "center";
        "fontSize", `int 22;
      ]
    let prompt ~bingo : polydict' = [
        "textAlign", `string "center";
        "marginBottom", `int 10;
        "fontWeight", `string "bold";
        "color", (if bingo then `string "green" else `undefined)
      ]
    let row : polydict' = [
        "alignSelf", `string "stretch";
        "marginVertical", `int 2;
        "marginHorizontal", `string "5%";
        "gap", `int 4;
        "justifyContent", `string "space-evenly";
        "alignItems", `string "stretch";
      ]
  end

  let[@react.component] body ?(initialAccumulatorValue = 3) () =
    let open Guikit in
    let accumulator, updateAccumulator =
      React.useState (constant initialAccumulatorValue) in
    let mode, updateMode = React.useState (constant (`plus : [ `plus | `minus ])) in
    let flip_mode = function `plus -> `minus | `minus -> `plus in
    ((text_str ~style:Style.accumulator
      & sprintf "Accumulator = %d" accumulator;
     ) :: (
       let mode_indicator, mode_effect = match mode with
         | `plus -> "+", (+)
         | `minus -> "-", Fn.flip (-)
       in
       let button' ?key ?onPress title =
         button title ?key ?onPress
         >! view ~style:[ "flexGrow", `int 1 ] in
       let row ?key elems = hview elems ?key ~style:Style.row in
       let action_button_row from =
         (iotaf &&> row) &
           ((+) from) &>
             fun x ->
             sprintf " %s%d" mode_indicator x
             |> button' ~onPress:(fun () -> updateAccumulator (mode_effect x))
       in
       ([ action_button_row 1 3;
          action_button_row 4 3;
          action_button_row 7 3;
          row [
              button' "MOD" ~onPress:(fun () ->
                  updateMode flip_mode);
              button' "RST" ~onPress:(fun () ->
                  updateAccumulator (constant initialAccumulatorValue));
              button' "NEG" ~onPress:(fun () ->
                  updateAccumulator (( * ) (-1)));
            ];
        ] |> view) :: [
           let bingo = accumulator = 0 in
           text_str ~style:(Style.prompt ~bingo)
             (if bingo
              then "You did it! (tap RST to start over)"
              else "Try to get the accumulator value to 0");
     ])
     |> view ~style:Style.container)

end (* module Accumulator_example *)

