import { Box } from '@chakra-ui/layout';
import { Stack, Text } from '@chakra-ui/react';
import router from 'next/router';
import Image from 'next/image';
import Date from './Date';
import { VFC, memo } from 'react';
import { postDataType } from 'type';

const ArticleCard: VFC<postDataType> = (props) => {
  const { id, date, title, image } = props;
  return (
    <Box
      w='300px'
      h='300px'
      bg='gray.100'
      borderRadius='20px'
      p='2'
      onClick={() => router.push(`/posts/${id}`)}
      _hover={{ opacity: 0.5, cursor: 'pointer' }}
      boxShadow='md'
    >
      <Stack textAlign='center'>
        <Image
          src={require(`../../posts/${id}/${image}`)}
          width='160px'
          height='160px'
          alt='thumbnail'
          objectFit='contain'
          className='articleCardImage'
        />
        <Text fontSize='lg' fontWeight='bold'>
          {title}
        </Text>
        <Date dateString={date} />
      </Stack>
    </Box>
  );
};

export default memo(ArticleCard);
