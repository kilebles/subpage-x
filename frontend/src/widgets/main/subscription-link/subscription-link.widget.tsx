import { IconBrandDiscord, IconBrandTelegram, IconBrandVk, IconCheck, IconCopy, IconMessageChatbot, IconQrcode } from '@tabler/icons-react'
import { ActionIcon, Group, Image, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useState } from 'react'
import { renderSVG } from 'uqr'

import { constructSubscriptionUrl } from '@shared/utils/construct-subscription-url'
import { useSubscription } from '@entities/subscription-info-store'
import { useTranslation } from '@shared/hooks'

import classes from './subscription-link.module.css'

interface IProps {
    hideGetLink: boolean
    supportUrl: string
}

export const SubscriptionLinkWidget = ({ hideGetLink, supportUrl }: IProps) => {
    const subscription = useSubscription()
    const { t, baseTranslations } = useTranslation()
    const [copied, setCopied] = useState(false)

    const subscriptionUrl = constructSubscriptionUrl(window.location.href, subscription.user.shortUuid)

    const handleCopyLink = () => {
        navigator.clipboard.writeText(subscriptionUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShowQr = () => {
        const qrSvg = renderSVG(subscriptionUrl, {
            whiteColor: '#161B22',
            blackColor: '#A855F7'
        })

        modals.open({
            centered: true,
            title: 'Другое устройство',
            classNames: {
                content: classes.modalContent,
                header: classes.modalHeader,
                title: classes.modalTitle
            },
            children: (
                <Stack align="center">
                    <Image
                        alt="QR"
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`}
                        style={{ borderRadius: 'var(--mantine-radius-md)' }}
                    />
                    <Text className={classes.qrCaption}>
                        Вы можете отсканировать qr с другого устройства, предварительно установив приложение.
                    </Text>
                </Stack>
            )
        })
    }

    const renderSupportLink = (supportUrl: string) => {
        const iconConfig = {
            't.me': { icon: IconBrandTelegram, color: '#0088cc' },
            'discord.com': { icon: IconBrandDiscord, color: '#5865F2' },
            'vk.com': { icon: IconBrandVk, color: '#0077FF' }
        }

        const matchedPlatform = Object.entries(iconConfig).find(([domain]) =>
            supportUrl.includes(domain)
        )

        const { icon: Icon } = matchedPlatform ? matchedPlatform[1] : { icon: IconMessageChatbot }

        return (
            <ActionIcon
                className={classes.actionIcon}
                component="a"
                href={supportUrl}
                radius={0}
                rel="noopener noreferrer"
                size={42}
                target="_blank"
                variant="default"
            >
                <Icon size={18} />
            </ActionIcon>
        )
    }

    return (
        <Group gap="xs" ml="auto" wrap="nowrap">
            {!hideGetLink && (
                <button
                    aria-label={t(baseTranslations.copyLink)}
                    className={`${classes.qrToggle} ${copied ? classes.qrToggleDone : ''}`}
                    onClick={handleCopyLink}
                    type="button"
                >
                    {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                </button>
            )}
            {!hideGetLink && (
                <button
                    aria-label="Другое устройство"
                    className={classes.qrToggle}
                    onClick={handleShowQr}
                    type="button"
                >
                    <IconQrcode size={18} />
                </button>
            )}
            {supportUrl !== '' && renderSupportLink(supportUrl)}
        </Group>
    )
}
