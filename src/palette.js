/**
 * The one place where the class colours live.
 *
 * Rule: hue = suitability, fill/opacity = invitation.
 * Suitable applicants keep their group colour, unsuitable applicants are grey
 * in both groups. Nothing here may depend on React or i18n.
 */
export const GROUP_COLORS = {
  pinkville: '#6a3d9a',
  greenfield: '#33a02c',
}

export const UNSUITABLE_COLOR = '#9e9e9e'

/** Opacity of the dots below the threshold in the threshold plots. */
export const NOT_INVITED_OPACITY = 0.45
