open Kxclib_melange
open Kxc_react_helpers

module ReactNative = struct

  external view :
    ?style:polydict
    -> ?children:React.element
    -> unit
    -> React.element
    = "View" [@@mel.module "react-native"]
  [@@react.component]

  external text :
    ?style:polydict
    -> ?children:React.element
    -> unit
    -> React.element
    = "Text" [@@mel.module "react-native"]
  [@@react.component]

  external button :
    title:string
    -> onPress:(_ -> unit)
    -> unit
    -> React.element
    = "Button" [@@mel.module "react-native"]
  [@@react.component]

  let hview =
    fun ?style children ->
    view children ~style:(
        polydict' ?base:style
          ["flexDirection", `string "row"])

end
