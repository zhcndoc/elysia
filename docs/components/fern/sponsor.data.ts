import { defineLoader } from 'vitepress'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export interface Sponsor {
    sponsorEntity: {
        login: string
        name: string
        avatarUrl: string
    }
    createdAt: string
    isOneTimePayment: boolean
    tier: {
        isOneTime: boolean
        isCustomAmount: boolean
        monthlyPriceInDollars: number
    }
    duration: string
}

export interface GoldSponsorDetail {
    url: string
    caption: string
}

declare const data: Sponsor[]
export { data }

// Key is sponsorEntity.login
export const goldSponsorDetail: Record<
    string,
    Sponsor['sponsorEntity']['login']
> = {}

// Sponsors contact to not be displayed
// although you will be able to see it here
// but you won't see the duration, and tier
const hidden = ['l2D']

export default defineLoader({
    async load(): Promise<Sponsor[]> {
        try {
            const result = await fetch('https://anymeta.top/github/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `query {
	                  user(login: "saltyaom") {
	                    sponsorshipsAsMaintainer(
	                        first: 100,
							activeOnly: true
	                    ) {
	                      nodes {
	                        sponsorEntity {
	                          ... on User {
	                            login
	                            name
	                            avatarUrl
	                          }
	                          ... on Organization {
	                            login
	                            name
	                            avatarUrl
	                          }
	                        }
	                        createdAt
	                        isOneTimePayment
	                        tier {
	                          isOneTime
	                          isCustomAmount
	                          monthlyPriceInDollars
	                        }
	                      }
	                    }
	                  }
	                }`
                })
            }).then((x) => x.json())

            const data: Sponsor[] =
                result.data?.user?.sponsorshipsAsMaintainer?.nodes || []

            return data
                .filter(
                    (x) =>
                        !x.isOneTimePayment &&
                        !hidden.includes(x.sponsorEntity.login)
                )
                .sort(
                    (a, b) =>
                        b?.tier?.monthlyPriceInDollars -
                            a?.tier?.monthlyPriceInDollars ||
                        new Date(a?.createdAt).getTime() -
                            new Date(b?.createdAt).getTime()
                )
                .map((sponsor) => ({
                    ...sponsor,
                    tier: sponsor.tier ?? {
                        isOneTime: false,
                        isCustomAmount: false,
                        monthlyPriceInDollars: 0
                    },
                    duration: dayjs()
                        .from(dayjs(sponsor.createdAt))
                        .replace('in', 'for')
                }))
        } catch (error) {
            console.warn('Fetch sponsors error')
            console.warn(error)

            return []
        }
    }
})
