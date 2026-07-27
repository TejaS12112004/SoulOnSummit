/**
 * useNewsletter — React Query mutation skeleton.
 *
 * Consumes: POST /api/v1/newsletter/subscribe via newsletterService.subscribe()
 *
 * To implement:
 *   1. Remove the placeholder throw.
 *   2. Replace with: return useMutation({ mutationFn })
 *   3. The NewsletterForm component requires no structural changes —
 *      simply call mutate({ email }) on form submit instead of setSubscribed(true).
 */
import { useMutation } from '@tanstack/react-query'
import type { NewsletterSubscribeRequest } from '@/services/newsletterService'

export function useNewsletter() {
  return useMutation<void, Error, NewsletterSubscribeRequest>({
    // TODO: implement — replace with newsletterService.subscribe(data)
    mutationFn: (_data) => {
      throw new Error('useNewsletter: not yet implemented')
    },
  })
}
