import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function InputFileUpload({ onFileSelect, name, style }) {
    return (
        <Button
            component="label"
            variant="contained"
            size="small"
            style={style}

            startIcon={<CloudUploadIcon />}
        >
            {name}

            <VisuallyHiddenInput type="file" onChange={(e) => onFileSelect(e.target.files[0])} />
        </Button>
    );
}






