(lang dune 3.9)
(name kxc-melange-react-native-template)

(using melange 0.1)

(license Apache-2.0)

(generate_opam_files true)

(package
 (name kxc-melange-react-native-template)
 (allow_empty)
 (depends
  (ocaml (and (>= 5.1.0) (< 5.2)))
  (melange (and (>= 2.0.0) (< 2.1)))

  ;; TODO: complete the list of dependencies
))
