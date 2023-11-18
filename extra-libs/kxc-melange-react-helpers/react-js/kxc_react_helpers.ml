open Kxclib_melange

module Belt_piping_ops = struct
  include PipeOps(struct
              module B = Belt.List
              type 'a t = 'a list
              let map f xs = B.map xs f
              let concat_map f xs =
                B.map xs f |> B.flatten
              let iter f xs = B.forEach xs f
              let fold_left f acc0 xs = B.reduce xs acc0 f
              let filter f xs = B.keep xs f
              let filter_map f xs = B.keepMap xs f
            end)
  let _ = List.map
end

module Js_val = struct
  type t

  type t' = ([
    | `any of t
    | `null | `undefined
    | `string of string
    | `bytes of Bytes.t (** repr as js Uint8array *)
    | `int of int
    | `float of float
    | `bool of bool
    | `polydict of t Js.Dict.t
    | `list of 'self list (** repr as js array *)
    | `array of 'self array (** repr as js array  *)
    | `tup2 of 'self * 'self (** repr as js array *)
    | `tup3 of 'self * 'self * 'self (** repr as js array *)
    ] as 'self)

  let as_js : _ -> t = Obj.magic

  let rec detagged : t' -> t =
    let cast = Obj.magic in
    function
    | `any x -> cast x
    | `float x -> cast x
    | `string x -> cast x
    | `bool x -> cast x
    | `int x -> cast x
    | `bytes x ->
       let module U8 = Js.Typed_array.Uint8Array in
       let len = Bytes.length x in
       let arr = U8.fromLength len in
       for idx = 0 to len do
         U8.unsafe_set arr idx (Bytes.get_uint8 x idx)
       done;
       cast arr
    | `null -> cast Js.null
    | `undefined -> cast Js.undefined
    | `tup2 (x1, x2) -> detagged (`array [| x1; x2 |]) |> cast
    | `tup3 (x1, x2, x3) -> detagged (`array [| x1; x2; x3 |]) |> cast
    | `array arr -> Belt.Array.map arr detagged |> cast
    | `list xs -> Belt.Array.map (Belt.List.toArray xs) detagged |> cast
    | `polydict dict -> cast dict
    | _ -> .
end
open struct
  type js_val = Js_val.t
  type js_val' = Js_val.t'
end

module Polydict : sig
  type key = Js.Dict.key

  type t = private js_val Js.Dict.t
  type field_list = (key * js_val') list

  val of_dict : _ Js.Dict.t -> t
  val to_dict : t -> js_val Js.Dict.t
  val of_list : ?base:t -> (key * js_val) list -> t
  val of_list' : ?base:t -> field_list -> t
  val to_list : t -> (key * js_val) list
  val get : key -> t -> js_val option
  val set : key -> js_val -> t -> unit
  val with_fields : (key * js_val) list -> t -> t
  val with_fields' : (key * js_val') list -> t -> t
  val clone : t -> t
end = struct
  type key = Js.Dict.key

  type t = js_val Js.Dict.t
  type field_list = (key * js_val') list

  let of_dict : _ Js.Dict.t -> t = Obj.magic
  let to_dict : t -> js_val Js.Dict.t = Obj.magic

  let get k dict = Js.Dict.get dict k
  let set k v dict = Js.Dict.set dict k v

  let to_list = Belt.List.fromArray % Js.Dict.entries
  let clone dict =
    let o = Js.Dict.empty() in
    Belt.Array.forEach (Js.Dict.keys dict) (
        fun key -> Js.Dict.(get dict key |> Option.iter (set o key))
      );
    o
  let with_fields fs dict =
    clone dict
    |-> (fun dict ->
      fs |!> (fun (k, v) -> set k v dict))

  let with_fields' fs dict =
    clone dict
    |-> (fun dict ->
      fs |!> (fun (k, v) -> set k (Js_val.detagged v) dict))

  let of_list ?base fs =
    match base with
    | None -> Js.Dict.fromList fs
    | Some base ->
       with_fields fs base

  let of_list' ?base fs =
    match base with
    | None ->
       Js.Dict.empty()
       |-> (fun o ->
        fs |!> (fun (k, v) ->
              o |> set k (Js_val.detagged v)))
    | Some base ->
       with_fields' fs base
end

module Rd (* short for ReactDom *) = struct
  let props = ReactDOM.domProps
  let sty = ReactDOMStyle.make

  let str = React.string

  let elems es = es |> Belt.List.toArray |> React.array

  external fragment :
    ?children:React.element
    -> unit
    -> React.element
    = "Fragment" [@@mel.module "react"]
  [@@react.component]


  let elp tag props children =
    ReactDOM.createDOMElementVariadic tag ~props (Array.of_list children)
  let elp' tag props children =
    ReactDOM.createDOMElementVariadic tag ~props:(props ReactDOM.domProps) (Array.of_list children)
  let el tag children =
    ReactDOM.createDOMElementVariadic tag (Array.of_list children)
  let elps tag props s =
    ReactDOM.createDOMElementVariadic tag ~props [|str s|]
  let els tag s =
    ReactDOM.createDOMElementVariadic tag [|str s|]
  let elpu tag props =
    ReactDOM.createDOMElementVariadic tag ~props [||]
  let elu tag =
    ReactDOM.createDOMElementVariadic tag [||]
end

module Rops (* short for ReactOps *) = struct
  let (&) f x = f x
  let (&!) f x = f [x]
  let (%!) g f x = g [f x]
  let (>!) x f = f [x]
end

module Pervasives = struct
  include Rd
  include Rops
  include Belt_piping_ops

  type js_val = Js_val.t
  type js_val' = Js_val.t'
  let detagged : Js_val.t' -> js_val = Js_val.detagged
  let as_js : _ -> js_val = Js_val.as_js

  type polydict = Polydict.t
  type polydict' = Polydict.field_list

  let polydict = Polydict.of_list
  let polydict' = Polydict.of_list'
end

include Pervasives
