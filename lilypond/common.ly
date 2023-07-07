
\paper {
  ragged-last = ##t
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

SU = \tweak arpeggio-direction #UP \arrow
SD = \tweak arpeggio-direction #DOWN \arrow

#(define RH rightHandFinger)


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%% %%%%%  Cut here ----- Start 'bbarred.ly'

%% C with slash -------------------------------
cWithSlash = \markup {
  \combine \roman C \translate #'(0.6 . -0.4) \draw-line #'(0 . 2.0)
}
%% Span -----------------------------------
%% Syntax: \bbarre #"text" { notes } - text = any number of box
bbarre =
#(define-music-function (barre location str music) (string? ly:music?)
   (let ((elts (extract-named-music music '(NoteEvent EventChord))))
     (if (pair? elts)
         (let ((first-element (first elts))
               (last-element (last elts)))
           (set! (ly:music-property first-element 'articulations)
                 (cons (make-music 'TextSpanEvent 'span-direction -1)
                       (ly:music-property first-element 'articulations)))
           (set! (ly:music-property last-element 'articulations)
                 (cons (make-music 'TextSpanEvent 'span-direction 1)
                       (ly:music-property last-element 'articulations))))))
   #{
       \once \override TextSpanner.font-size = #-2
       \once \override TextSpanner.font-shape = #'upright
       \once \override TextSpanner.staff-padding = #3
       \once \override TextSpanner.style = #'line
       \once \override TextSpanner.to-barline = ##f
       \once \override TextSpanner.bound-details =
            #`((right
                (text . ,#{ \markup { \draw-line #'( 0 . -.5) } #})
                (Y . 0)
                (padding . 0.25)
                (attach-dir . 2))
               (left
                (text . ,#{ \markup { \cWithSlash #str } #})
                (Y . 0)
                (padding . 0.25)
                (attach-dir . -2)))
      $music
   #})

fbarre =
#(define-music-function (fbarre location str music) (string? ly:music?)
   (let ((elts (extract-named-music music '(NoteEvent EventChord))))
     (if (pair? elts)
         (let ((first-element (first elts))
               (last-element (last elts)))
           (set! (ly:music-property first-element 'articulations)
                 (cons (make-music 'TextSpanEvent 'span-direction -1)
                       (ly:music-property first-element 'articulations)))
           (set! (ly:music-property last-element 'articulations)
                 (cons (make-music 'TextSpanEvent 'span-direction 1)
                       (ly:music-property last-element 'articulations))))))
   #{
       \once \override TextSpanner.font-size = #-2
       \once \override TextSpanner.font-shape = #'upright
       \once \override TextSpanner.staff-padding = #3
       \once \override TextSpanner.style = #'line
       \once \override TextSpanner.to-barline = ##f
       \once \override TextSpanner.bound-details =
            #`((right
                (text . ,#{ \markup { \draw-line #'( 0 . -.5) } #})
                (Y . 0)
                (padding . 0.25)
                (attach-dir . 2))
               (left
                (text . ,#{ \markup { \roman C #str } #})
                (Y . 0)
                (padding . 0.25)
                (attach-dir . -2)))
      $music
   #})

%% %%%%%%%  Cut here ----- End 'bbarred.ly'
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%%%%%%% Cut here ----- Start 'flamenco.ly'
% Text indicators :
abanico = ^\markup\small { \italic Abanico }
rasgueado = ^\markup\small { \italic Ras. }
alzapua = ^\markup\small { \italic Alzapua }

% Finger stroke symbols :
strokeUp = \markup\combine\override #'(thickness . 1.3) \draw-line #'(0 . 2)\raise #2 \arrow-head #Y #UP ##f
strokeDown = \markup\combine\arrow-head #Y #DOWN ##f \override #'(thickness . 1.3) \draw-line #'(0 . 2)

% Golpe symbol :
golpe = \markup {
  \filled-box #'(0 . 1) #'(0 . 1) #0
  \hspace #-1.6
  \with-color #white
  \filled-box #'(0.15 . 0.85) #'(0.15 . 0.85) #0
}

% Strokes, fingers and golpe command :
RHp = \rightHandFinger #1
RHi = \rightHandFinger #2
RHm = \rightHandFinger #3
RHa = \rightHandFinger #4
RHc = \rightHandFinger #5
RHu = \tweak staff-padding 5 \rightHandFinger \strokeUp
RHd = \tweak staff-padding 5 \rightHandFinger \strokeDown
RHg = \tweak staff-padding 5 \rightHandFinger \golpe

headsOff = {
  \hide TabNoteHead
  \hide NoteHead
  \override NoteHead.no-ledgers = ##t
}
headsOn = {
  \override TabNoteHead.transparent = ##f
  \override NoteHead.transparent = ##f
  \override NoteHead.no-ledgers = ##f
}
%%%%%%% Cut here ----- End 'flamenco.ly'
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
