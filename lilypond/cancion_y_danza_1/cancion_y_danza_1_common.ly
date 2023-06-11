
\header {
  title = "Cancion y Danza No. 1"
  composer = "Antonio Ruiz-Pipo"
  arranger = "Arr. John Asmuth"
  tagline = ""
}

\paper {
  ragged-last = ##t
  ragged-bottom = ##t
}


arrow =
\tweak stencil
#(lambda (grob)
   (match-let*
         ((staff-space
           (ly:staff-symbol-staff-space grob))
          ((and positions (bottom . top))
           (interval-scale (ly:grob-property grob 'positions)
                           staff-space))
          (dir (ly:grob-property grob 'arpeggio-direction)))
     (grob-interpret-markup
      grob
      #{
        \markup \overlay {
          \path #0.1
                #`((moveto ,0.5 ,bottom)
                   (lineto ,0.5 ,top))
          \translate #(cons 0.5 (interval-index positions dir))
            \general-align #Y #(- dir)
              \arrow-head #Y #dir ##t
        }
      #})))
\arpeggio

strumUp = \tweak arpeggio-direction #UP \arrow
strumDown = \tweak arpeggio-direction #DOWN \arrow


upstrum = {
\override Arpeggio.stencil = #point-stencil
}

\include "../bbarred.ly"
#(define RH rightHandFinger)

\include "cancion.ly"
\include "danza.ly"
