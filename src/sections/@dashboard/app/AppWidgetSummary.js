// @mui
import PropTypes from 'prop-types';
import {alpha, styled} from '@mui/material/styles';
import {Card, Typography} from '@mui/material';
// utils
import {fShortenNumber} from '../../../utils/formatNumber';
// components

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({theme}) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
    color: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    sx: PropTypes.object,
    name: PropTypes.string
};

export default function AppWidgetSummary({name, title, total, icon, color = 'primary', sx, ...other}) {
    return (
        <Card
            sx={{
                py: 5,
                boxShadow: 0,
                textAlign: 'center',
                color: (theme) => theme.palette[color].darker,
                bgcolor: (theme) => theme.palette[color].lighter,
                ...sx,
            }}
            {...other}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                {name}
            </Typography>
            <StyledIcon
                sx={{
                    color: (theme) => theme.palette[color].dark,
                    backgroundImage: (theme) =>
                        `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
                            theme.palette[color].dark,
                            0.24
                        )} 100%)`,
                }}
            >
                {/*<Iconify icon={icon} width={24} height={24} />*/}
                <img src={icon} width={45} height={45} alt={"Popcorn"}/>
            </StyledIcon>

            <Typography variant="h3">{fShortenNumber(total)}</Typography>

            <Typography variant="subtitle2" sx={{opacity: 0.72}}>
                {title}
            </Typography>
        </Card>
    );
}
