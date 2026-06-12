\version "2.20.0"
\header {
  title = "Baritone Scales"
  composer = "John Asmuth"
}

% Baritone valve helper: filled circle = pressed, open circle = not pressed.
% Codes: 0, 1, 2, 3, 12, 13, 23, 123 (valves 1–3 left to right).
#(define (baritone-valve-list finger)
  (cond
    ((string=? finger "0") '())
    ((string=? finger "1") '(1))
    ((string=? finger "2") '(2))
    ((string=? finger "3") '(3))
    ((string=? finger "12") '(1 2))
    ((string=? finger "13") '(1 3))
    ((string=? finger "23") '(2 3))
    ((string=? finger "123") '(1 2 3))
    (else
     (ly:warning "Unknown baritone valve code ~a" finger)
     '())))

#(define (baritone-valve-active? finger valve)
  (memq valve (baritone-valve-list finger)))

bv-valve-radius = #0.3
% Filled dot; open ring uses \circle (not \draw-circle ##f, which reads as a blob).
bv-valve-closed = \markup \draw-circle #bv-valve-radius #0 ##t
bv-valve-open = \markup {
  \override #'((circle-padding . 0.08) (thickness . 1.0))
  \circle {
    \hspace #0.32
  }
}

#(define (baritone-valve-circle-markup pressed?)
  (if pressed? bv-valve-closed bv-valve-open))

#(define (baritone-valves-markup finger)
  #{\markup {
      \fontsize #-4
      \translate #(cons 0 -0.4)
      \line {
        #(baritone-valve-circle-markup (baritone-valve-active? finger 1))
        \hspace #0.18
        #(baritone-valve-circle-markup (baritone-valve-active? finger 2))
        \hspace #0.18
        #(baritone-valve-circle-markup (baritone-valve-active? finger 3))
      }
    }#})

baritone-valve =
#(define-music-function (finger music) (string? ly:music?)
   #{
     #music _\markup #(baritone-valves-markup finger)
   #})

\paper {
  ragged-last = ##f
  ragged-right = ##f
}

baritoneScalesLayout = \layout {
  \context {
    \Score
    \override SpacingSpanner.strict-note-spacing = ##t
    \override SpacingSpanner.spacing-increment = #1.4
    proportionalNotationDuration = #(ly:make-moment 1 16)
  }
  \context {
    \Staff
    \override TextScript.padding = #1.5
  }
}

\score {
  <<
    \new Staff \with {
      instrumentName = #"B♭ major"
    } {
      \clef bass
      \time 4/4
      \key bes \major
      \relative c {
        \baritone-valve "0" bes4 \baritone-valve "13" c8 \baritone-valve "12" d8
        \baritone-valve "1" es8 \baritone-valve "0" f8 \baritone-valve "12" g8
        \baritone-valve "2" a8 \baritone-valve "0" bes4
        \baritone-valve "2" a8 \baritone-valve "12" g8 \baritone-valve "0" f8
        \baritone-valve "1" es8 \baritone-valve "12" d8 \baritone-valve "13" c8
        \break
		\baritone-valve "0" bes1 \bar "|."
      }
    }
  >>
  \baritoneScalesLayout
}
\score {
  <<
    \new Staff \with {
      instrumentName = #"C major"
    } {
      \clef bass
      \time 4/4
      \key c \major
      \relative c {
        \baritone-valve "0" c4 \baritone-valve "0" d8 \baritone-valve "1" e8
        \baritone-valve "0" f8 \baritone-valve "12" g8 \baritone-valve "2" a8
        \baritone-valve "12" b8 \baritone-valve "0" c4
        \baritone-valve "12" b8 \baritone-valve "2" a8 \baritone-valve "12" g8
        \baritone-valve "0" f8 \baritone-valve "1" e8 \baritone-valve "0" d8
        \break
        \baritone-valve "0" c1 \bar "|."
      }
    }
  >>
  \baritoneScalesLayout
}
\score {
  <<
    \new Staff \with {
      instrumentName = #"E♭ major"
    } {
      \clef bass
      \time 4/4
      \key ees \major
      \relative c {
        \baritone-valve "2" ees4 \baritone-valve "0" f8 \baritone-valve "0" g8
        \baritone-valve "2" aes8 \baritone-valve "0" bes8 \baritone-valve "0" c8
        \baritone-valve "0" d8 \baritone-valve "2" ees4
        \baritone-valve "0" d8 \baritone-valve "0" c8 \baritone-valve "0" bes8
        \baritone-valve "2" aes8 \baritone-valve "0" g8 \baritone-valve "0" f8
        \break
        \baritone-valve "2" ees1 \bar "|."
      }
    }
  >>
  \baritoneScalesLayout
}
