open Kxclib_melange
open Kxc_react_helpers

module ReactNative = struct

  let elems = Rd.elems
  let fragment = Rd.fragment

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

  let text_str ?key ?style str =
    text ?key ?style &! Rd.str str

  external button :
    title:string
    -> ?onPress:(_ -> unit)
    -> unit
    -> React.element
    = "Button" [@@mel.module "react-native"]
  [@@react.component]

  let hview =
    fun ?key ?style children ->
    view children ?key ~style:(
        polydict' ?base:style
          ["flexDirection", `string "row"])

end
